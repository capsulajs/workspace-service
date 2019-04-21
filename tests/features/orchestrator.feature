Background:
  Given a valid 'flow' is an object with three valid entries called 'name', 'id' and 'execute'

 Scenario: Orchestrator is initiated with configuration with one valid flow - flow is executed
  Given Workspace service including service A and service B
  And   Orchestrator including in its configuration a valid flow between service A and B
  When  the Workspace starts and Orchestrator is initiated
  Then  the flow between service A and B is executed

 Scenario: Orchestrator is initiated with configuration with two or more valid flows - flows are executed
  Given Workspace service including service A and service B
  And   Orchestrator including in its configuration two or more valid flows between service A and B
  When  the Workspace starts and Orchestrator is initiated
  Then  the flows between service A and B are executed

Scenario: Orchestrator is initiated with a config with a flow that doesn't match the pattern - an error is returned
  Given Workspace service including service A and service B
  And   Orchestrator including in its configuration a flow that doesn't match the following pattern
         |property| type     |
		 |name    | string   |
		 |id      | string   |
		 |execute | function |
  When  the Workspace starts and Orchestrator is initiated
  Then  a relevant error is returned

Scenario: Orchestrator is initiated with a configuration with no flow inside - an error is returned
    Given Workspace service including service A and service B
	And   Orchestrator with an empty configuration (no flow inside)
    When  the Workspace starts and Orchestrator is initiated
	Then  a relevant error is returned

Scenario: Orchestrator is initiated with a configuration with empty flow - an error is returned
    Given Workspace service including service A and service B
	And   Orchestrator including in its configuration an empty flow
    When  the Workspace starts and Orchestrator is initiated
	Then  a relevant error is returned

Scenario: Initiating Orchestrator with no configuration returns error
    Given Workspace service including service A and service B
	And   Orchestrator without configuration
    When  the Workspace starts and Orchestrator is initiated
	Then  a relevant error is returned

Scenario: Initiating Orchestrator with empty token or token not a string returns error
    Given Workspace service including service A and service B
    And   Orchestrator including in its configuration a valid flow between service A and B
    And   Orchestrator has no token or a token which is not string
    When  the Workspace starts and Orchestrator is initiated
    Then  a relevant error is returned

Scenario: Execute a flow with a function that returns error
   Given Workspace service including service A and service B
   And   Orchestrator including in its configuration a valid flow between service A and B
   And   The flow has an execute function which will return error when executed
   When  the Workspace starts and Orchestrator is initiated
   And   the flow between service A and B is executed
   And   a notification about the error in execute function is returned

 Scenario: The function of one of the flows returns error
   Given Workspace service including service A and service B
   And   Orchestrator including in its configuration few  valid flows between service A and B
   And   One of the flows has an execute function which will return error when executed
   When  the Workspace starts and Orchestrator is initiated
   And   the flows between service A and B are executed
   And   a notification about the error in execute function is returned
