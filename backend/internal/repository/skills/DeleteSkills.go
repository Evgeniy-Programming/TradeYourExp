package skills

import (
	"context"
	"database/sql"
)

// DeleteSkill удаляет обмен, только если он принадлежит username.
func (r *Repository) DeleteSkill(ctx context.Context, id int, username string) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM skills WHERE id = $1 AND username = $2`, id, username)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
