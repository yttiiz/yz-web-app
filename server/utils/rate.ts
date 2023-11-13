import { RateType } from "@mongo";

export class Rate {
  public static average(rate: RateType, rateCount = 0) {
    let rateSummary = 0;

    for (const rateType in rate) {
      rateCount += rate[rateType as keyof RateType];

      switch (rateType) {
        case "excellent": {
          rateSummary += 5 * rate[rateType as keyof RateType];
          break;
        }

        case "good": {
          rateSummary += 4 * rate[rateType as keyof RateType];
          break;
        }

        case "quiteGood": {
          rateSummary += 3 * rate[rateType as keyof RateType];
          break;
        }

        case "bad": {
          rateSummary += 2 * rate[rateType as keyof RateType];
          break;
        }

        default: {
          rateSummary += 1 * rate[rateType as keyof RateType];
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