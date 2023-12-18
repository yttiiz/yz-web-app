import { ReviewsProductSchemaWithIDType } from "@mongo";

export class Rate {
  public static average(
    reviewsDocument: ReviewsProductSchemaWithIDType,
    rateCount = 0
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
    }).format(rateSummary === 0
        ? 0
        : rateSummary / rateCount
      );
  }
}
