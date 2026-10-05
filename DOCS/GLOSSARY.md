# Signet careers

Recruitment landing for Signet retail stores in Belarus. Candidates apply through one form on the Landing.

## Language

**Candidate**:
A person who wants to work at SigNet and submits an Application.
_Avoid_: user, visitor, lead, applicant (use Candidate in copy-adjacent code; Application is the artefact)

**Consultant**:
The hired in-store role: sales consultant in a SigNet shop. The form still asks for a desired position in free text.
_Avoid_: seller, cashier, employee, vacancy title variants until HR copy arrives

**Store**:
A physical Signet shop. City names with stores are the Application city enum.
_Avoid_: shop, point, outlet, location (City is a field on Store, not a separate entity yet)

**Application**:
The form payload a Candidate submits: name, +375 phone, city, desired position, optional resume URL, PDN consent.
_Avoid_: lead, request, ticket, resume, track, store/office split

**City**:
One of 24 Belarus city names on the Application. The official store-city list lives in `src/lib/cities.ts`.
_Avoid_: shop, location

**Landing**:
The single public page that sells working at SigNet and hosts the apply form.
_Avoid_: site, portal, careers site

**Apply API**:
The HTTP interface of this repo that accepts an Application.
_Avoid_: backend, server, endpoint (those are implementation)

**HR adapter**:
The module that stores an Application for HRIS to pull. `deliverApplication` writes the file inbox; HRIS reads `GET /api/hr/applications` with a Bearer key.
_Avoid_: CRM, Bitrix, webhook (HRIS has no public inbound URL)

**Design system**:
Signet visual tokens: black `#000000`, white `#ffffff`, red `#ed1c24`, gray `#F2F2F2`, Libre Franklin (Muller later). Light and dark themes; the Candidate picks one in the header.
_Avoid_: theme, skin (say light theme / dark theme)
