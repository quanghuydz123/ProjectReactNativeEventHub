
export interface PromotionModel {
    _id: string,
    title:string,
    discountType:'FixedAmount' | 'Percentage',
    discountValue:number,
    startDate:Date,
    endDate:Date,
    status:'NotStarted' | 'Ongoing' | 'Ended' | 'Canceled'
  }