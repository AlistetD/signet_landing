# Apply API in-repo, HR app behind an adapter

The browser posts only to this repo's Apply API. Delivery into Signet's internal HR app goes through an `deliverApplication` adapter. The HR contract is unknown; coupling the form to it would freeze the UI. Direct client→HR calls were rejected: secrets and PII handling belong on the server.

**Status:** accepted  
**Date:** 2026-09-22
