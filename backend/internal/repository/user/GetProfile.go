package user

import (
	"Trade-y-exp/internal/models"
	"database/sql"
)

func (r *Repository) GetMyProfile(userId string) (*models.ProfileRequest, error) {
	u := &models.ProfileRequest{}
	var firstName, lastName, socialLink sql.NullString
	q := `SELECT id, username, email, first_name, last_name, social_link, created_at FROM users WHERE id = $1`
	err := r.db.QueryRow(q, userId).Scan(&u.ID, &u.Username, &u.Email, &firstName, &lastName, &socialLink, &u.CreatedAt)
	if firstName.Valid {
		u.FirstName = firstName.String
	}
	if lastName.Valid {
		u.LastName = lastName.String
	}
	if socialLink.Valid {
		u.SocialLink = socialLink.String
	}
	return u, err
}

func (r *Repository) GetProfile(username string) (*models.ProfileRequest, error) {
	u := &models.ProfileRequest{}
	var firstName, lastName, socialLink sql.NullString
	q := `SELECT id, username, email, first_name, last_name, social_link, created_at FROM users WHERE username = $1`
	err := r.db.QueryRow(q, username).Scan(&u.ID, &u.Username, &u.Email, &firstName, &lastName, &socialLink, &u.CreatedAt)
	if firstName.Valid {
		u.FirstName = firstName.String
	}
	if lastName.Valid {
		u.LastName = lastName.String
	}
	if socialLink.Valid {
		u.SocialLink = socialLink.String
	}
	return u, err
}

func (r *Repository) GetMyProfileStatic(userId string) (*models.ProfileRequest, error) {
	u := &models.ProfileRequest{}
	var socialLink sql.NullString
	q := `SELECT username, email, social_link, created_at FROM users WHERE id = $1`
	err := r.db.QueryRow(q, userId).Scan(&u.Username, &u.Email, &socialLink, &u.CreatedAt)
	if socialLink.Valid {
		u.SocialLink = socialLink.String
	}
	return u, err
}
