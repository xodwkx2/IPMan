# IPMan
IP management system for ~~work~~ Study

- mongodb, express, node.js

mongoDB connection
- mongodb://localhost/nfv

----
## Purpose
- to manage a C class ip range assigned manually 
- to record an internal ip range and a gateway
- to automation annoying things

----

Client has 
- name (eng, kor) [String]
- registration number [Number]
- vnf manufacturer [String]
- vnf management IP [String]
- vnf IP [String]
- service name [String]
- flag [Boolean]

Branch has
- client ID [ObjectID]
- name (eng, kor) [String]
- registration number  [Number]
- vrf number [Number]
- internal IP range [String]
- gateway IP [String]
- public IP [String]
- VPRN [Number]
- flag [Boolean]

--------

