package repository

import (
	"Trade-y-exp/internal/models"
	"database/sql"

	"github.com/google/uuid"
)

func (r *PgRepo) CreateUser(u *models.User) error {
	u.ID = uuid.New()
	q := `INSERT INTO users (id, username, email, password, first_name, last_name, social_link) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := r.db.Exec(q, u.ID, u.Username, u.Email, u.Password, u.FirstName, u.LastName, u.SocialLink)
	return err
}

func (r *PgRepo) UpdateUser(u *models.User, id string) error {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	q := `UPDATE users SET username=$1, email=$2, password=$3 WHERE id=$4`
	result, err := r.db.Exec(q, u.Username, u.Email, u.Password, parsedID)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *PgRepo) GetByEmail(email string) (*models.User, error) {
	u := &models.User{}
	q := `SELECT id, username, email, password, first_name FROM users WHERE email = $1`
	err := r.db.QueryRow(q, email).Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.FirstName)
	return u, err
}

func (r *PgRepo) DeleteUser(id string) error {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return err
	}
	q := `DELETE FROM users WHERE id=$1`
	res, err := r.db.Exec(q, parsedID)
	if err != nil {
		return err
	}
	count, _ := res.RowsAffected()
	if count == 0 {
		return sql.ErrNoRows
	}
	return nil
}
