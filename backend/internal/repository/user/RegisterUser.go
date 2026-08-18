package user

import (
	"Trade-y-exp/internal/models"

	"github.com/google/uuid"
)

func (r *Repository) CreateUser(u *models.User) error {
	u.ID = uuid.New()
	q := `INSERT INTO users (id, username, email, password, first_name, last_name, social_link) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := r.db.Exec(q, u.ID, u.Username, u.Email, u.Password, u.FirstName, u.LastName, u.SocialLink)
	return err
}
