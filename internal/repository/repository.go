package repository

// import (
// 	"Trade-y-exp/internal/models"
// 	"database/sql"
// 	"fmt"

// 	"github.com/google/uuid"
// 	_ "github.com/lib/pq"
// )

// type Storage interface {
// 	CreateUser(u *models.User) error
// 	UpdateUser(u *models.User, id string) error
// 	DeleteUser(id string) error
// 	GetByEmail(email string) (*models.User, error)
// 	SaveSkill(s *models.Skill) error
// 	FetchSkills() ([]models.Skill, error)
// 	GetDB() *sql.DB
// 	DeleteSkill(id string) error
// }

// type PgRepo struct {
// 	db *sql.DB
// }

// func NewPg(connStr string) (*PgRepo, error) {
// 	db, err := sql.Open("postgres", connStr)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return &PgRepo{db: db}, db.Ping()
// }

// func (r *PgRepo) GetDB() *sql.DB {
// 	return r.db
// }

// func (r *PgRepo) CreateUser(u *models.User) error {
// 	u.ID = uuid.New()
// 	q := `INSERT INTO users (id, username, email, password, first_name, last_name, social_link)
//           VALUES ($1, $2, $3, $4, $5, $6, $7)`
// 	_, err := r.db.Exec(q, u.ID, u.Username, u.Email, u.Password, u.FirstName, u.LastName, u.SocialLink)
// 	return err
// }

// func (r *PgRepo) UpdateUser(u *models.User, id string) error {
// 	// 1. Превращаем строку в UUID, чтобы Postgres не ругался на типы
// 	parsedID, err := uuid.Parse(id)
// 	if err != nil {
// 		return err
// 	}

// 	q := `UPDATE users SET username=$1, email=$2, password=$3 WHERE id=$4`
// 	result, err := r.db.Exec(q, u.Username, u.Email, u.Password, parsedID)
// 	if err != nil {
// 		return err
// 	}
// 	rows, _ := result.RowsAffected()
// 	if rows == 0 {
// 		return sql.ErrNoRows
// 	}
// 	return nil
// }

// func (r *PgRepo) DeleteUser(id string) error {
// 	parsedID, err := uuid.Parse(id)
// 	if err != nil {
// 		return err
// 	}
// 	q := `DELETE FROM user WHERE id=$1`
// 	result, err := r.db.Exec(q, parsedID)
// 	if err != nil {
// 		return err
// 	}
// 	rowsAffected, err := result.RowsAffected()
// 	if err != nil {
// 		return err
// 	}

// 	if rowsAffected == 0 {
// 		return sql.ErrNoRows
// 	}

// 	return nil
// }

// func (r *PgRepo) GetByEmail(email string) (*models.User, error) {
// 	u := &models.User{}
// 	q := `SELECT id, username, email, password, first_name FROM users WHERE email = $1`
// 	err := r.db.QueryRow(q, email).Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.FirstName)
// 	if err != nil {
// 		fmt.Printf("Error: %#v\n", err) // покажите этот вывод
// 		return nil, err
// 	}
// 	return u, nil
// }

// func (r *PgRepo) SaveSkill(s *models.Skill) error {
// 	q := `INSERT INTO skills (username, skill, exchange) VALUES ($1, $2, $3)`
// 	_, err := r.db.Exec(q, s.Username, s.Skill, s.Exchange)
// 	return err
// }

// func (r *PgRepo) DeleteSkill(id string) error {
// 	q := `DELETE FROM skills WHERE id=$1`
// 	result, err := r.db.Exec(q, id)
// 	if err != nil {
// 		return err
// 	}
// 	rowsAffected, err := result.RowsAffected()
// 	if err != nil {
// 		return err
// 	}

// 	if rowsAffected == 0 {
// 		return sql.ErrNoRows
// 	}

// 	return nil
// }

// func (r *PgRepo) FetchSkills() ([]models.Skill, error) {
// 	rows, err := r.db.Query("SELECT id, username, skill, exchange FROM skills ORDER BY id DESC")
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	var res []models.Skill
// 	for rows.Next() {
// 		var s models.Skill
// 		rows.Scan(
// 			&s.ID,
// 			&s.Username,
// 			&s.Skill,
// 			&s.Exchange,
// 		)
// 		res = append(res, s)
// 	}

// 	return res, nil
// }
