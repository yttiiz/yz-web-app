import { BookingsProductSchemaWithIDType, BookingsType, ReviewsProductSchemaWithIDType } from "@mongo";

type ReturnBookingAvailabilityType = {
  isAvailable: false;
  booking: BookingsType;
} | {
  isAvailable: true;
};

export class Handler {
  public static rateAverage(
    reviewsDocument: ReviewsProductSchemaWithIDType,
    rateCount = 0,
  ) {
    const { reviews } = reviewsDocument;
    let rateSummary = 0;

    for (const review of reviews) {
      rateCount++;
      rateSummary += review.rate;
    }

    return new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(rateSummary === 0 ? 0 : rateSummary / rateCount);
  }

  public static getProductAvailability(booking: BookingsType | undefined) {
    if (booking) {
      const today = Date.now();
      const startingDate = new Date(booking.startingDate).getTime();
      const endingDate = new Date(booking.endingDate).getTime();

      return {
        isAvailable: today < startingDate || today > endingDate,
        endingDate,
      }
    }

    return {
      isAvailable: true,
      endingDate: undefined,
    };
  }

  public static getProductPresentOrNextBookings(bookings: BookingsType[]) {
    if (bookings.length > 0) {
      const today = Date.now();
      const presentOrNextBookings = [];

      for (const booking of bookings) {
        if (
          new Date(booking.startingDate).getTime() > today ||
          new Date(booking.endingDate).getTime() >= today
        ) {
          presentOrNextBookings.push(booking);
        }
      }

      return presentOrNextBookings;
    }

    return bookings;
  }

  public static compareBookings(
    newBooking: BookingsType,
    bookings: BookingsProductSchemaWithIDType,
  ): ReturnBookingAvailabilityType {
    let bool = true;
    const nextBookings = Handler
    .getProductPresentOrNextBookings(bookings.bookings);
    const getTime = (date: string) => new Date(date).getTime();
    
    for (const booking of nextBookings) {
      if (
        getTime(newBooking.startingDate) > getTime(booking.startingDate) &&
        getTime(newBooking.startingDate) <= getTime(booking.endingDate)
      ) {
        bool = false;
        return {
          isAvailable: bool,
          booking,
        };
      }
    }

    return {
      isAvailable: bool,
    };
  }
}
