package user

import "Trade-y-exp/internal/models"

func (r *Repository) GetByEmail(email string) (*models.User, error) {
	u := &models.User{}
	q := `SELECT id, username, email, password, first_name FROM users WHERE email = $1`
	err := r.db.QueryRow(q, email).Scan(&u.ID, &u.Username, &u.Email, &u.Password, &u.FirstName)
	return u, err
}

func (r *Repository) GetUsernameByEmail(email string) (string, error) {
	var username string
	q := `SELECT username FROM users WHERE email = $1`
	err := r.db.QueryRow(q, email).Scan(&username)
	return username, err
}
