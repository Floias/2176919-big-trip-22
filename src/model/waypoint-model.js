import Observable from '../framework/observable.js';
import { getRandomWaypoint } from '../mock/waypoints.js';

const WAYPOINT_COUNT = 7;

export default class WaypointModel extends Observable {
  #waypointsApiService;
  #waypoints = Array.from({ length: WAYPOINT_COUNT }, getRandomWaypoint);

  constructor({ waypointsApiService }) {
    super();
    this.#waypointsApiService = waypointsApiService;

    this.#waypointsApiService.waypoints.then((waypoints) => {
      console.log(waypoints.map(this.#adaptToClient));
    });
  }

  /**
    * @returns {RandomWaypoint[]}
    */
  get waypoints() {
    return this.#waypoints;
  }

  updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      update,
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    this.#waypoints = [
      update,
      ...this.#waypoints,
    ];

    this._notify(updateType, update);
  }

  deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptToClient(waypoint) {
    const adaptedWaypoint = {
      ...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'],
      dateTo: waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
      offersId: waypoint.offers,
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['is_favorite'];
    delete adaptedWaypoint['offers'];

    return adaptedWaypoint;
  }
}
