Scenario: Call createWorkspace with a token with no configuration available is rejected with error
   Given WorkspaceFactory instance with createWorkspace method 
   And   A token 123 which has no configuration available
   When  I call createWorkspace method with token 123
   Then  I expect to receive an error
  
Scenario: Call createWorkspace with a token with invalid configuration is rejected with error
   Given WorkspaceFactory instance with createWorkspace method 
   And   A token 123 which has a configuration with wrong format
   When  I call createWorkspace method with token 123
   Then  I expect to receive an error

Scenario: Call createWorkspace with a token with invalid format is rejected with error
   Given WorkspaceFactory instance with createWorkspace method
   When  I call createWorkspace with invalid <token> values
         |token     |
         |' '       |
         |{}        |
         |{ test: 'test' }|
         |[]        |
         |['test']  |
         |null      |
         |undefined |
         |true      |
         |false     |
         |0         |
         |-1        | 
    Then  I expect to receive an error	 
	
Scenario: Call createWorkspace when a Workspace is created creates new instance of Workspace
    Given WorkspaceFactory instance with createWorkspace method 
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  I run createWorkspace method with token 123 and Workspace is created
    When I run createWorkspace method again with same token
    Then I receive a new instance of Workspace

Scenario: An error with importing a service occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method 
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that calls registerService
    When I run createWorkspace method with token 123
    And  An error with importing a service occurs
    Then I expect to receive an error

Scenario: An error with importing a component occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method 
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with importing a component occurs
    Then I expect to receive an error

Scenario: An error with registering a component occurs after calling createWorkspace
    Given WorkspaceFactory instance with createWorkspace method 
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run createWorkspace method with token 123
    And  An error with registering a component occurs
    Then I expect to receive an error


Scenario: Call services method returns a map of promises to each service loaded in Workspace
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B include a bootstrap that calls registerService
    And   the bootstrap includes CAPSULAHUB_WORKSPACE and CAPSULAHUB_CONFIGURATION variable
    When  I run createWorkspace method with token 123 and Workspace is created
    And   I call services method
    Then  I expect to receive a map of promises to service A and B having the following <property>s
          |<property> |
          |serviceName|
          |displayName|
          |proxy      |
    And   each of the promises is resolved with corresponding service 

Scenario: Call components method returns a map of promises to each component loaded in Workspace
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    When  I run createWorkspace method with token 123 and Workspace is created
    And   I call workspace components method
    Then  I expect to receive a map of promises to component 1 and 2 with the following <property>s
          |<property>   |
          |componentName|
          |nodeSelector |
          |reference    |

Scenario: Call registerService method registers the provided service in the Workspace
    Given WorkspaceFactory instance with createWorkspace method
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B include a bootstrap that call registerService
    When I run createWorkspace method with token 123 and Workspace is created
    And  I call registerService method with service A and with a valid request 
	And  The request has the following <property> and <type>
         |<property> | <type>|
         |serviceName| string|
         |displayName| string|
         |reference  | any   |
    Then Service A is registered in the Workspace

Scenario: Call registerService method with a service already registered is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B include a bootstrap that calls registerService
    And   I run createWorkspace with token 123 and Workspace is created
    And   I call registerService method with service A and service is registered
	When  I call registerService method again with service A
    Then  I expect to receive an error

Scenario: Call registerService method with an invalid serviceName is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I run createWorkspace with token 123 and Workspace is created
    And   I call workspace registerService method with invalid values for <serviceName> and valid displayName
          |<serviceName> |
          |''        |
          |{}        |
          |{ test: 'test' }|
          |[]        |
          |['test']  |
          |null      |
          |undefined |
          |true      |
          |false     |
          |0         |
          |-1        |
    Then  I expect to receive an error

Scenario: Call registerService method with an invalid displayName is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I run createWorkspace with token 123 and Workspace is created
    And   I call workspace registerService method with invalid values for <displayName> and valid serviceName
          |<displayName> |
          |''        |
          |{}        |
          |{ test: 'test' }|
          |[]        |
          |['test']  |
          |null      |
          |undefined |
          |true      |
          |false     |
          |0         |
          |-1        |
    Then I expect to receive an error

Scenario: Call registerService method with a service that doesnt's exist in configuration is rejected with error
    Given WorkspaceFactory instance with createWorkspace method
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B include a bootstrap that calls registerService
    When  I run createWorkspace with token 123 and Workspace is created
    And   I call registerService method with service C
    Then  I expect to receive an error
