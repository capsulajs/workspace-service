Background:
  Given a valid 'flow' is an object with three valid properties as
        |property| type     |
        |name    | string   |
        |id      | string   |
        |execute | function |
  And   a valid 'configuration' is an object with a unique property called 'flows'
  And   'flows' is an array of 'flow'

 Scenario: Orchestrator is initiated with configuration with one valid flow - flow is executed
  Given Workspace service including service A and service B
  And   Orchestrator including in its configuration a valid flow between service A and B
  When  Orchestrator is initiated
  Then  the Promise is resolved

 Scenario: Orchestrator is initiated with configuration with two or more valid flows - flows are executed
  Given Workspace service including service A and service B
  And   Orchestrator including in its configuration two or more valid flows between service A and B
  When  Orchestrator is initiated
  Then  the Promise is resolved

Scenario: Initiating Orchestrator with no configuration returns error
  Given Workspace service including service A and service B
  And   Orchestrator without configuration
  When  Orchestrator is initiated
  Then  the Promise is rejected with an NoConfigurationError

Scenario: Orchestrator is initiated with an invalid config - an error is returned
  Given Workspace service including service A and service B
  And   Orchestrator including an invalid <configuration>
        |<configuration>           |
        |null                      |
        |undefined                 |
        |'test'                    |
        |123                       |
        |true                      |
        |[]                        |
        |['test']                  |
        |{}                        |
        |{ test: [] }              |
        |{ flows: [], test: [] }   |
  When  Orchestrator is initiated
  Then  the Promise is rejected with an InvalidConfigurationError

Scenario: Orchestrator is initiated with a config with a flows that doesn't match the pattern - an error is returned
  Given Workspace service including service A and service B
  And   Orchestrator including a configuration with a unique <flows> property
        |<flows>                   |
        |null                      |
        |undefined                 |
        |'test'                    |
        |123                       |
        |true                      |
        |['test']                  |
        |{}                        |
  When  Orchestrator is initiated
  Then  the Promise is rejected with an InvalidConfigurationError

Scenario: Orchestrator is initiated with a configuration with empty flows
    Given Workspace service including service A and service B
	And   Orchestrator including a valid configuration with an empty flows
    When  Orchestrator is initiated
	Then  the Promise is resolved

 Scenario: The function of one of the flows returns error
   Given Workspace service including service A and service B
   And   Orchestrator including in its configuration few  valid flows between service A and B
   And   One of the flows has an execute function which will return error when executed
   When  Orchestrator is initiated
   And   the flows between service A and B are executed
   And   a notification about the error in execute function is returned

Scenario: Orchestrator is initiated with a flow containing a non existing service
  Given Workspace service including service A and service B
  And   Orchestrator including in its configuration a valid flow between service A and C
  When  Orchestrator is initiated
  Then  the Promise is rejected with a nonExistingServiceError
