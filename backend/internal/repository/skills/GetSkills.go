package skills

import (
	"Trade-y-exp/internal/models"
	"Trade-y-exp/pkg/repo"
	"context"
	"database/sql"
	"fmt"
	"strings"
)

// ListSkills возвращает карточки обменов с учётом фильтров. Пустой результат — пустой срез.
func (r *Repository) ListSkills(ctx context.Context, f models.SkillFilter) ([]models.SkillCard, error) {
	var (
		where []string
		args  []any
	)
	arg := func(v any) string {
		args = append(args, v)
		return fmt.Sprintf("$%d", len(args))
	}

	if f.Category != "" {
		if !repo.IsValidCategory(f.Category) {
			return nil, ErrInvalidCategory
		}
		where = append(where, "s.category = "+arg(f.Category))
	}
	if f.Username != "" {
		where = append(where, "s.username = "+arg(f.Username))
	}
	if search := strings.TrimSpace(f.Search); search != "" {
		pattern := arg("%" + strings.NewReplacer(`\`, `\\`, "%", `\%`, "_", `\_`).Replace(search) + "%")
		switch f.SearchIn {
		case "skill":
			where = append(where, "s.skill ILIKE "+pattern)
		case "exchange":
			where = append(where, "s.exchange ILIKE "+pattern)
		default:
			where = append(where, "(s.skill || ' ' || s.exchange || ' ' || COALESCE(sd.description, '') || ' ' || s.username) ILIKE "+pattern)
		}
	}

	q := `
		SELECT s.id, s.category, COALESCE(sd.description, ''), COALESCE(s.skill, ''), COALESCE(s.exchange, ''),
		       s.contact_type, s.contact_value, COALESCE(s.username, ''), s.created_at, s.status
		FROM skills s
		LEFT JOIN skill_descriptions sd ON sd.skill_id = s.id`
	if len(where) > 0 {
		q += " WHERE " + strings.Join(where, " AND ")
	}
	q += " ORDER BY s.created_at DESC, s.id DESC"

	rows, err := r.db.QueryContext(ctx, q, args...)
	if err != nil {
		return nil, fmt.Errorf("list skills: %w", err)
	}
	defer rows.Close()

	cards := []models.SkillCard{}
	for rows.Next() {
		var c models.SkillCard
		if err := rows.Scan(&c.ID, &c.Category, &c.Description, &c.Skill, &c.Exchange,
			&c.ContactType, &c.ContactValue, &c.Username, &c.CreatedAt, &c.Status); err != nil {
			return nil, err
		}
		cards = append(cards, c)
	}
	return cards, rows.Err()
}

// GetStats считает обмены пользователя: итоги по статусам и по месяцам за последний год.
func (r *Repository) GetStats(ctx context.Context, username string) (*models.SkillStats, error) {
	stats := &models.SkillStats{ByMonth: []models.SkillStatsMonth{}}
	err := r.db.QueryRowContext(ctx, `
		SELECT COUNT(*),
		       COUNT(*) FILTER (WHERE status = 'ACTIVE'),
		       COUNT(*) FILTER (WHERE status = 'CLOSED')
		FROM skills WHERE username = $1`, username).Scan(&stats.Total, &stats.Active, &stats.Closed)
	if err != nil {
		return nil, fmt.Errorf("skill totals: %w", err)
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT to_char(m.month, 'YYYY-MM'), COUNT(s.id)
		FROM generate_series(date_trunc('month', NOW()) - INTERVAL '11 months', date_trunc('month', NOW()), INTERVAL '1 month') AS m(month)
		LEFT JOIN skills s ON s.username = $1 AND date_trunc('month', s.created_at) = m.month
		GROUP BY m.month
		ORDER BY m.month`, username)
	if err != nil {
		return nil, fmt.Errorf("skill stats by month: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var m models.SkillStatsMonth
		if err := rows.Scan(&m.Month, &m.Count); err != nil {
			return nil, err
		}
		stats.ByMonth = append(stats.ByMonth, m)
	}
	return stats, rows.Err()
}

func (r *Repository) GetDescriptionBySkillID(ctx context.Context, skillID int) (*models.SkillDescription, error) {
	var desc models.SkillDescription
	err := r.db.QueryRowContext(ctx, `
        SELECT 
            sd.id, sd.skill_id, sd.description, sd.media, sd.created_at,
            s.skill, s.exchange, s.username
        FROM skill_descriptions sd
        JOIN skills s ON s.id = sd.skill_id
        WHERE sd.skill_id = $1
    `, skillID).Scan(
		&desc.ID, &desc.SkillID, &desc.Description, &desc.Media, &desc.CreatedAt,
		&desc.Skill, &desc.Exchange, &desc.Username,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &desc, err
}

func (r *Repository) GetAllDescriptions(ctx context.Context) ([]models.SkillDescription, error) {
	rows, err := r.db.QueryContext(ctx, `
        SELECT sd.id, sd.skill_id, sd.description, sd.media, sd.created_at,
               s.skill, s.exchange, s.username
        FROM skill_descriptions sd
        JOIN skills s ON s.id = sd.skill_id
        ORDER BY sd.created_at DESC
    `)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var descs []models.SkillDescription
	for rows.Next() {
		var d models.SkillDescription
		if err := rows.Scan(&d.ID, &d.SkillID, &d.Description, &d.Media, &d.CreatedAt,
			&d.Skill, &d.Exchange, &d.Username); err != nil {
			return nil, err
		}
		descs = append(descs, d)
	}
	return descs, rows.Err()
}
