# flight
_FastTrack'D Final Project_

###GENERAL DESCRIPTION

The intent of this project is to create an interface for users to book flights.

The idea of a flight is greatly simplified from reality. In this world, the flights will only go to four cities: 

* Orlando, 
* Miami, 
* Tallahassee, and 
* Jacksonville

A new set of five flights is generated every "day". A day is definined in the FlightService. A day lasts as long as the `@Scheduled` annotation indicates. 
_feel free to change this value to assist in your testing_

A flight has a _origin_, _destination_, _flight time_, and _offset_

* The origin is the city the flight departs from
* The destination is the city the flight lands in
* The flight time is the number of hours the flight spends in the air
* The offset is the number of hours the flight waits from the beginning of the day until the flight departs


### SET UP

1. Create a schema named "ftd_flight" through mysql workbench.
2. Run the project to generate tables
3. Execute the contents of location.sql to populate the locations table


### PROJECT REQUIREMENTS

* Create a website where any visitor can see the up to date list of available flights

The list of available flights must updated in real time.

* Allow a user to create a profile and log in to that profile

* If a user logs in, allow them to search for flights between an origin and destination city

The results of this search must be updated in real time

* The app must find a flight or series of flights (in the case of layovers) that will get the user from the origin to the destination _the fastest_

_A layover of zero is not valid_

If there is no possible route, the user must be made aware that they cannot travel to that destination from their origin at this time

* Once an itinerary is presented to the user, the user must be given the option to book the itinerary

* The user must have a page that displays all of their previously booked itineraries, the total flight time, and the total layover time

* The user must be given the option to view their booked itinerary on a map as provided by the MapController

In the scenario of a multi-flight itinerary, lines must be displayed with a different color for each branch of the journey

Information must be provided on the map template page that shows the user the order the line segments occur in, the flight time for that segment, and the layover time in each particular city
