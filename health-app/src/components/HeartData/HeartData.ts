export interface HeartData {
    startDate: Date,
    endDate: Date,
    value: number,
}

export interface StressData extends HeartData {
    deviation: number
    stressState: string
}