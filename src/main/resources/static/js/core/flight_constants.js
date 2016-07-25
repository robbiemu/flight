/* globals angular */

const MODULE_NAME = 'flight'

angular.module(MODULE_NAME)
  .constant('moduleName', MODULE_NAME)
  .constant('ScriptsDir', 'js/')
  .constant('StylesDir', 'css/')
  .constant('DomainsDir', 'js/domain/')
  .constant('Routes', {})
/*		  {'home': 
		  	{'scripts': ['home/home_controller.js', 'home/home_service.js'],
			  'styles': []
		  	}
		  }) */
