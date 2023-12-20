import { render, replace, RenderPosition } from '../framework/render.js';
import FormEdit from '../view/form-edit.js';
import Filters from '../view/filters.js';
import Sorting from '../view/sorting.js';
import Waypoint from '../view/waypoint.js';
import ButtonNewEvent from '../view/button-new-event.js';
export default class TripPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #waypointModel = null;
  #filters = new Filters();
  #sorting = new Sorting();
  #buttonNewEvent = new ButtonNewEvent();
  #waypoints = [];

  constructor({ headerContainer, mainContainer, waypointModel }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#waypointModel = waypointModel;
  }

  init() {
    this.#waypoints = [...this.#waypointModel.waypoints];
    render(this.#filters, this.#headerContainer);
    render(this.#sorting, this.#mainContainer);
    render(this.#buttonNewEvent, this.#headerContainer, RenderPosition.AFTEREND);
    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypoint(this.#waypoints[i]);
    }
  }

  #renderWaypoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const waypoint = new Waypoint({
      waypoint: point,
      offers: [...this.#waypointModel.getOffersById(point.type, point.offersId)],
      destination: this.#waypointModel.getDestinationsById(point.destination),
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const formEdit = new FormEdit({
      waypoint: point,
      offersType: this.#waypointModel.getOffersByType(point.type),
      offers: [...this.#waypointModel.getOffersById(point.type, point.offersId)],
      destination: this.#waypointModel.getDestinationsById(point.destination),
      destinationAll: this.#waypointModel.destinations,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(formEdit, waypoint);
    }

    function replaceFormToPoint() {
      replace(waypoint, formEdit);
    }
    render(waypoint, this.#mainContainer);
  }
}
