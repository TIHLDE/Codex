---
url: v1/user
method:
  - POST
response codes:
  - "201"
  - "404"
  - "401"
requires auth: true
permissions:
---
*Creates a user document associated with the current account's id*
# Request
```json
	"first_name": "Test",
	"last_name": "Tester",
	"avatar_url": "https://random.avatar.com/43928392",
	"settings": {
		"language": "no",
		"measure_unit": "metric",
		"email_on": false,
		"theme_mode": "system",
		"bl_ingredient_ids": [
			"5bd71552-5031-43ab-bdcf-86020773f55f",
			"a1ccca1b-16fd-4df5-a13d-03d048990711",
			"84a6115d-e43f-4495-ab76-b3f280d495db"
		]
	}
```

# Responses

## `201 CREATED`

**Content example**

```json
{
    "id": "5e0f685d-e290-4176-91a8-7dcc26cc89e7",
	"email": "email@test.com",
	"time_joined": "2023-12-05T20:16:05+0000",
	"first_name": "Test",
	"last_name": "Tester",
	"avatar_url": "https://random.avatar.com/43928392",
	"plan": "free",
	"settings": {
		"language": "no",
		"measure_unit": "metric",
		"email_on": false,
		"theme_mode": "system",
		"bl_ingredients": [
			"Charcoal",
			"Banana"
		]
	}
}
```

**Schema**

```yaml
id: UUID
email: string
time_joined: ISO_8601
first_name: string
last_name: string
avatar_url: string
plan: enum ["free", "premium"]
settings:
	language: enum ["no", "en"]
	measure_unit: enum ["imperial", "metric"] 
	email_on: bool
	theme_mode: enum ["system", "light", "dark"]
	bl_ingredients:
	 - string
```

## `401 Unauthorized`

```text
Unauthorized
```

**Notes:**
- No account associated with the current user ID evaluates to `401 Unauthorized`