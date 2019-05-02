
Scenario: Calling workspace services when workspace is started
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I run workspace start method
    And   I call workspace services method
    Then  I expect to receive service A and B with the following <property>s
          |<property> |
          |serviceName|
          |displayName|
          |proxy      |

Scenario: Calling workspace components when workspace is started
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    When  I run workspace start method
    And   I call workspace components method
    Then  I expect to receive components 1 and 2 with the following <property>s
          |<property>   |
          |componentName|
          |nodeSelector|
          |reference   |

Scenario: Calling workspace services when workspace is not started
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I call workspace services method
    Then  I expect to receive an error

Scenario: Calling workspace components when workspace is not started
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    When  I call workspace components method
    Then  I expect to receive an error

Scenario: Calling start method when workspace is started
    Given Workspace service instantiated with token 123
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Workspace is started
    When I run workspace start method again
    Then I expect to receive an error


Scenario: Calling start method while an error with importing a service occurred
    Given Workspace service instantiated with token 123
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B includes a bootstrap that call registerService
    When I run workspace start method
    And  An error with importing a service occurred
    Then I expect to receive an error

Scenario: Calling start method while an error with importing a component occurred
    Given Workspace service instantiated with token 123
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run workspace start method
    And  An error with importing a component occurred
    Then I expect to receive an error

Scenario: Calling start method while an error with registering a component occurred
    Given Workspace service instantiated with token 123
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    When I run workspace start method
    And  An error with registering a component occurred
    Then I expect to receive an error

Scenario: Calling registerService method when workspace is started
    Given Workspace service instantiated with token 123
    And  Configuration for token 123 that includes service A and B and components 1 and 2
    And  Service A and service B includes a bootstrap that call registerService
    When I run workspace start method
    And  I call workspace registerService method with a valid request and with the following <property> and <type>
         |serviceName| string|
         |displayName| string|
         |reference  | any   |
    Then The provided service is registred to the workspace

Scenario: Calling registerService method when workspace is not started
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I call workspace registerService method with a valid RegisterServiceRequest
    Then  I expect to receive an error

Scenario: Calling registerService method with an registered service
    Given  Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I run workspace start method
    And   I call workspace registerService method for a service that was already registered
    Then  I expect to receive an error

Scenario: Calling registerService method with an invalid serviceName
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I run workspace start method
    And   I call workspace registerService method with invalid values for <serviceName>
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

Scenario: Calling registerService method with an invalid displayName
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I run workspace start method
    And   I call workspace registerService method with invalid values for <displayName>
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

Scenario: Calling registerService method with an non-existing service
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    And   Service A and service B includes a bootstrap that call registerService
    When  I run workspace start method
    And   I call workspace registerService method with valid request but non-existing service
    Then  I expect to receive an error

Scenario: Calling workspace config should return a promise that includes all existing services and components
    Given Workspace service instantiated with token 123
    And   Configuration for token 123 that includes service A and B and components 1 and 2
    When  I call workspace config method
    Then  I expect to receive workspace config that includes service A and B and components 1 and 2

