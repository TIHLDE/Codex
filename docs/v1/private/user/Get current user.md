---
url: v1/user/current
method:
  - GET
response codes:
  - "200"
  - "404"
  - "401"
requires auth: true
permissions:
---
*Get the details of the currently Authenticated User along with basic profile information*

# Responses

## `200 OK`

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

## `404 Not found`

```text
Not found
```

## `401 Unauthorized`

```text
Unauthorized
```