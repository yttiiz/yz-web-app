import {
  BookingsProductSchemaWithIDType,
  BookingsType,
  ReviewsProductSchemaWithIDType,
} from "@mongo";
import type { ReturnBookingAvailabilityType } from "./mod.ts";

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
      };
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
          Handler.getTime(booking.startingDate) > today ||
          Handler.getTime(booking.endingDate) >= today
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
    let nextBookings = Handler
      .getProductPresentOrNextBookings(bookings.bookings);

    nextBookings = nextBookings.sort((a, b) => (
      Handler.getTime(a.startingDate) - Handler.getTime(b.startingDate)
    ));

    for (const booking of nextBookings) {
      const isInsideBooking = 
        Handler.getTime(newBooking.startingDate) > Handler.getTime(booking.startingDate) &&
        Handler.getTime(newBooking.startingDate) <= Handler.getTime(booking.endingDate);

      const isSurroundingBooking = 
        Handler.getTime(newBooking.startingDate) < Handler.getTime(booking.startingDate) &&
        Handler.getTime(newBooking.endingDate) >= Handler.getTime(booking.endingDate);
      
      if (isInsideBooking || isSurroundingBooking) {
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

  public static setInputDateMinAttribute(lastBookings: BookingsType[]) {
    const today = new Date();

    for (const booking of lastBookings) {
      if (
        Handler.getTime(booking.startingDate) > today.getTime() ||
        Handler.getTime(booking.endingDate) >= today.getTime()
      ) {
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

      } else {
        return booking.endingDate;
      }
    }
  }

  private static getTime(date: string) {
    return new Date(date).getTime();
  }
    
}
