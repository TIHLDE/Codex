This documentation site represents an up-to-date representation of all API endpoints exposed by the Food-Manager backend API, and is meant to be consumed by any frontend related to Food-Manager.

The API is divided into three parts respectively:
- **private**
	- Authenticated API used by Food-Manager frontends with authenticated users, which allows authorized access to Food-Manager's database resources and other resources made available by the API.
- **public**
	- Unauthenticated API used by unauthenticated clients to access public data and information provided by the API, such as stats, example information and others.
- **admin**
	- Authenticated API used by administrators of the Food-Manager API, which allows administration of users among other resources made available by the API. Such access is granted on a "need-to-use" basis and MUST be kept secured.