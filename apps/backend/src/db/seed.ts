import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "./index.ts";
import {
	classroomsTable,
	groupsTable,
	schedulesTable,
	specialtiesTable,
	subjectsTable,
	teachersTable,
	usersTable,
} from "./schema.ts";

function translit(str: string): string {
	const map: Record<string, string> = {
		А: "a",
		Б: "b",
		В: "v",
		Г: "g",
		Д: "d",
		Е: "e",
		Ё: "e",
		Ж: "zh",
		З: "z",
		И: "i",
		Й: "y",
		К: "k",
		Л: "l",
		М: "m",
		Н: "n",
		О: "o",
		П: "p",
		Р: "r",
		С: "s",
		Т: "t",
		У: "u",
		Ф: "f",
		Х: "h",
		Ц: "c",
		Ч: "ch",
		Ш: "sh",
		Щ: "sch",
		Ъ: "",
		Ы: "y",
		Ь: "",
		Э: "e",
		Ю: "yu",
		Я: "ya",
		а: "a",
		б: "b",
		в: "v",
		г: "g",
		д: "d",
		е: "e",
		ё: "e",
		ж: "zh",
		з: "z",
		и: "i",
		й: "y",
		к: "k",
		л: "l",
		м: "m",
		н: "n",
		о: "o",
		п: "p",
		р: "r",
		с: "s",
		т: "t",
		у: "u",
		ф: "f",
		х: "h",
		ц: "c",
		ч: "ch",
		ш: "sh",
		щ: "sch",
		ъ: "",
		ы: "y",
		ь: "",
		э: "e",
		ю: "yu",
		я: "ya",
	};
	return str
		.split("")
		.map((c) => map[c] ?? c)
		.join("")
		.replace(/[^a-zA-Z0-9]/g, "");
}

async function seed() {
	const teacherNames = [
		"Ларина П.В.",
		"Марков М.О.",
		"Смирнов П.В.",
		"Майоров А.А.",
		"Савас С.А.",
		"Козлова Л.В.",
		"Сверчков А.Е.",
		"Шавшина Н.А.",
		"Курашев В.А.",
		"Михонов Д.А.",
		"Гребельный Ю.Т.",
		"Бабыкин И.Г.",
		"Дербенёва О.М.",
		"Петрик А.Ю.",
	];

	const teacherUserRecords = teacherNames.map((fullName) => {
		const [lastName, initials] = fullName.split(" ");
		const firstName = initials?.split(".")[0] ?? "";
		const emailLocal =
			`${translit(firstName)}.${translit(lastName)}` ||
			`teacher${Math.random().toString(36).slice(2, 6)}`;
		return {
			id: randomUUID(),
			firstName,
			lastName,
			patronymic: null,
			email: `${emailLocal.toLowerCase()}@example.com`,
			password: "TEST",
			role: "teacher" as const,
		};
	});

	await db.insert(usersTable).values(teacherUserRecords);

	const teacherRecords = teacherUserRecords.map((u) => ({
		id: randomUUID(),
		userId: u.id,
	}));
	await db.insert(teachersTable).values(teacherRecords);

	const teacherMap: Record<string, string> = {};
	teacherNames.forEach((name, idx) => {
		teacherMap[name] = teacherRecords[idx].id;
	});

	const specialtyId = randomUUID();
	await db.insert(specialtiesTable).values({
		id: specialtyId,
		code: "TEST",
		name: "Тестовая специальность",
		durationYears: 4,
	});

	const groupNames = [
		"1 ССА1-09/24",
		"1 ССА2-09/24",
		"1 ССА3-09/24",
		"1 РЭУ1-09/24",
		"1 РЭУ2-09/24",
		"1 РЭУ3-09/24",
		"2 ИСП1-09/23",
		"2 ИСП2-09/23",
		"2 ИСП3-09/23",
		"2 ИСП4-09/23",
		"2 ИСП5-09/23",
		"2 РПУ1-09/23",
		"2 ССА1-09/23",
	];

	const groups = groupNames.map((g, i) => {
		const course = Number(g.trim()[0]);
		const curatorId = teacherRecords[i % teacherRecords.length].id;
		return {
			id: randomUUID(),
			curatorId,
			name: g,
			course,
			durationYears: 4,
			specialtyId,
		};
	});
	await db.insert(groupsTable).values(groups);

	const groupMap: Record<string, string> = {};
	groups.forEach((g) => (groupMap[g.name] = g.id));

	const classroomNums = [212, 304, 202, 311, 213, 407, 209, 511, 413];
	const classrooms = classroomNums.map((num) => ({
		id: randomUUID(),
		number: num,
	}));
	await db.insert(classroomsTable).values(classrooms);
	const classroomMap: Record<number, string> = {};
	classrooms.forEach((c) => (classroomMap[c.number] = c.id));

	const subjectNames = [
		"Практическая подготовка",
		"Информатика",
		"АСОИиБД",
		"Физика",
		"Химия",
		"Основы алгоритмизации",
		"Основы философии",
		"Проектирование БД",
		"Радиоэлектронные ПУС",
		"Физическая культура",
		"Безопасность труда",
		"Материаловедение",
		"Компьютерные сети",
	];
	const subjects = subjectNames.map((name) => ({ id: randomUUID(), name }));
	await db.insert(subjectsTable).values(subjects);
	const subjectMap: Record<string, string> = {};
	subjects.forEach((s) => (subjectMap[s.name] = s.id));

	const monday = 1;
	const pairTimes = [
		{ start: "08:00", end: "09:30" },
		{ start: "09:40", end: "11:10" },
		{ start: "11:20", end: "12:50" },
	];

	async function addLesson(
		pair: number,
		groupName: string,
		subj: string,
		teacherName: string,
		room?: number,
	) {
		const groupId = groupMap[groupName];
		if (!groupId) return;
		const subjectId = subjectMap[subj] ?? subjectMap["Информатика"];
		const teacherId = teacherMap[teacherName] ?? teacherRecords[0].id;
		const classroomId = room ? classroomMap[room] : null;

		console.log(groupId, subjectId, teacherId, classroomId);

		await db.insert(schedulesTable).values({
			id: randomUUID(),
			dayOfWeek: monday,
			startTime: pairTimes[pair - 1].start,
			endTime: pairTimes[pair - 1].end,
			groupId,
			subjectId,
			teacherId,
			classroomId,
		});
	}

	await addLesson(
		1,
		"1 ССА1-09/24",
		"Практическая подготовка",
		"Ларина П.В.",
		212,
	);
	await addLesson(1, "1 ССА2-09/24", "Информатика", "Марков М.О.");
	await addLesson(1, "1 ССА3-09/24", "АСОИиБД", "Смирнов П.В.", 304);
	await addLesson(1, "1 РЭУ1-09/24", "Физика", "Майоров А.А.", 202);
	await addLesson(1, "2 ИСП1-09/23", "УП.12.01", "Савас С.А.", 311);

	await addLesson(2, "1 ССА1-09/24", "Информатика", "Марков М.О.");
	await addLesson(
		2,
		"1 ССА2-09/24",
		"Практическая подготовка",
		"Ларина П.В.",
		212,
	);
	await addLesson(2, "1 ССА3-09/24", "АСОИиБД", "Смирнов П.В.", 304);

	console.log("Seed completed");
}

seed().then(() => process.exit(0));
