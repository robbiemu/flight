/* globals angular */

const MODULE_NAME = 'flight'

angular.module(MODULE_NAME)
  .constant('moduleName', MODULE_NAME)
  .constant('ScriptsDir', 'js/')
  .constant('StylesDir', 'css/')
  .constant('DomainsDir', 'js/domain/')
  .constant('Routes', {})
	.constant('SPRING_FINDROUTE_URI', '/flights')
	.constant('SPRING_FLIGHTS_URI', '/flights')
	.constant('SPRING_LOGIN_URI', '/user/login')
	.constant('SPRING_REGISTER_URI', '/user/register')
	.constant('SPRING_FIND_ITIN_BYUSER_URI', '/user/itineraries')

/*		  {'home':
		  	{'scripts': ['home/home_controller.js', 'home/home_service.js'],
			  'styles': []
		  	}
		  }) */
