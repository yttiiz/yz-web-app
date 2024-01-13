/*=================================================| DATA |=================================================*/

// Users ///////////////////////////

/**
 * @typedef {Object} User User model
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 * @property {string} birth
 * @property {string} job
 * @property {string} photo
 * @property {string} role
 */

/** @typedef {Record<number, User>} Users Users list */

// Products ///////////////////////////

/**
 * @typedef {Object} Details
 * @property {number} area
 * @property {number} price
 * @property {number} rooms
 * @property {string} type
 */

/**
 * @typedef {Object} Images
 * @property {string} src
 * @property {string} alt
 */

/**
 * @typedef {Object} Product Product model
 * @property {string} name
 * @property {string} description
 * @property {Details} details
 * @property {Images} thumbnail
 * @property {Images[]} pictures
 * @property {string} bookingId
 * @property {string} reviewId
 */

/** @typedef {Record<number, Product>} Products Products list */

// Bookings ///////////////////////////

/**
 * @typedef {Object} BookingsRegistred
 * @property {string} userId
 * @property {string} userName
 * @property {string} startingDate
 * @property {string} endingDate
 * @property {number} createdAt
 */

/**
 * @typedef {Object} Booking
 * @property {BookingsRegistred[]} bookings
 * @property {string} productName
 * @property {string} productId
 */

/** @typedef {Record<number, Booking} Bookings Bookings list */

/*=================================================| INTERFACE |=================================================*/

/** @typedef {[HTMLImageElement, HTMLParagraphElement, HTMLParagraphElement, HTMLParagraphElement, HTMLParagraphElement]} UserCardDivDetails */

export {};
