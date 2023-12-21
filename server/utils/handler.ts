import { BookingsType, ReviewsProductSchemaWithIDType } from "@mongo";

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

  public static getProductPresentAndFutureBooking(bookings: BookingsType[]) {
    if (bookings.length > 0) {
      const today = Date.now();

      return bookings.filter((booking) => {
        return (
          new Date(booking.startingDate).getTime() > today ||
          new Date(booking.endingDate).getTime() >= today
        )
      })
    }

    return bookings;
  }
}
