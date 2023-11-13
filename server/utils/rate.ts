import { RateProductType } from "@mongo";

export class Rate {
  public static average(rate: RateProductType, rateCount = 0) {
    let rateSummary = 0;

    for (const rateType in rate) {
      rateCount += rate[rateType as keyof RateProductType];

      switch (rateType) {
        case "excellent": {
          rateSummary += 5 * rate[rateType as keyof RateProductType];
          break;
        }

        case "good": {
          rateSummary += 4 * rate[rateType as keyof RateProductType];
          break;
        }

        case "quiteGood": {
          rateSummary += 3 * rate[rateType as keyof RateProductType];
          break;
        }

        case "bad": {
          rateSummary += 2 * rate[rateType as keyof RateProductType];
          break;
        }

        default: {
          rateSummary += 1 * rate[rateType as keyof RateProductType];
          break;
        }
      }
    }

    return Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 1,
    })
      .format(rateSummary / rateCount);
  }
}
