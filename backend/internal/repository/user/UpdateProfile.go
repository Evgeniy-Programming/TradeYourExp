package user

import (
	"Trade-y-exp/internal/models"
	"errors"

	"github.com/google/uuid"
)

var ErrUsernameTaken = errors.New("username already exists")

// UpdateProfile обновляет только заполненные поля профиля.
// При смене username переносит на него запросы пользователя в skills.
func (r *Repository) UpdateProfile(u *models.UpdateProfileRequest, id string) error {
	parsedID, err := uuid.Parse(id)
	if err != nil {
		return err
	}

	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var oldUsername string
	if err := tx.QueryRow(`SELECT username FROM users WHERE id=$1`, parsedID).Scan(&oldUsername); err != nil {
		return err
	}

	if u.Username != "" && u.Username != oldUsername {
		var exists bool
		q := `SELECT EXISTS(SELECT 1 FROM users WHERE username=$1 AND id<>$2)`
		if err := tx.QueryRow(q, u.Username, parsedID).Scan(&exists); err != nil {
			return err
		}
		if exists {
			return ErrUsernameTaken
		}
		if _, err := tx.Exec(`UPDATE skills SET username=$1 WHERE username=$2`, u.Username, oldUsername); err != nil {
			return err
		}
	}

	q := `UPDATE users SET
			username=COALESCE(NULLIF($1, ''), username),
			email=COALESCE(NULLIF($2, ''), email),
			first_name=COALESCE(NULLIF($3, ''), first_name),
			last_name=COALESCE(NULLIF($4, ''), last_name),
			social_link=COALESCE(NULLIF($5, ''), social_link)
		  WHERE id=$6`
	if _, err := tx.Exec(q, u.Username, u.Email, u.FirstName, u.LastName, u.SocialLink, parsedID); err != nil {
		return err
	}

	return tx.Commit()
}
