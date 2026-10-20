# Junior contracts

The portable boundary shared by Web, WeChat Mini Program, iOS, Android and the API. Keep this package free of UI and platform globals. Additive fields are preferred; breaking changes require a new API version and a migration note.

The current Web server remains the reference implementation. `services/junior-api/openapi.yaml` is the transport contract for extracting it into an independently deployable service.
