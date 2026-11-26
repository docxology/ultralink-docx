# Design

Graph entities have stable identifiers, type labels, and optional
attributes. Links carry a source identifier, target identifier, and
relationship type. Exporters read the same graph and project it into
the records or markup expected by their destination.

JSON represents metadata beside entity and relationship arrays
[@json_standard]. GraphML stores directed endpoints on edge
elements and attaches attributes through keyed data [@graphml].
CSV supplies separate entity and relationship tables. Clients
can join those tables using the named identifiers [@csv_standard].
