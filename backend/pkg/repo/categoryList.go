package repo

type Category string

const (
	CategoryIT          Category = "it"
	CategoryCommunicate Category = "communicate"
	CategoryArt         Category = "art"
	CategoryKnowledge   Category = "knowledge"
	CategoryHobby       Category = "hobby"
)

var validCategories = map[Category]struct{}{
	CategoryIT:          {},
	CategoryCommunicate: {},
	CategoryArt:         {},
	CategoryKnowledge:   {},
	CategoryHobby:       {},
}

func IsValidCategory(c string) bool {
	_, ok := validCategories[Category(c)]
	return ok
}
