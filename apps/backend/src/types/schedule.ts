export interface WeekScheduleItem {
	id: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
	subject: {
		id: string;
		name: string;
	};
	group: {
		id: string;
		name: string;
		course: number;
	};
	classroom: {
		id: string;
		number: number;
	} | null;
}

export interface WeekScheduleResponse {
	weekStart: string;
	weekEnd: string;
	schedule: WeekScheduleItem[];
}
