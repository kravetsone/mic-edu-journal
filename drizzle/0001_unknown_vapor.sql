CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
	"curator_id" uuid NOT NULL,
	"name" text NOT NULL,
	"course" smallint NOT NULL,
	"duration_years" integer NOT NULL,
	"specialty_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now () NOT NULL,
	CONSTRAINT "groups_name_unique" UNIQUE ("name")
);

--> statement-breakpoint
CREATE TABLE "specialties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"duration_years" integer NOT NULL,
	"created_at" timestamp DEFAULT now () NOT NULL,
	CONSTRAINT "specialties_code_unique" UNIQUE ("code"),
	CONSTRAINT "specialties_name_unique" UNIQUE ("name")
);

--> statement-breakpoint
ALTER TABLE "students"
ADD COLUMN "group_id" uuid NOT NULL;

--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_curator_id_teachers_id_fk" FOREIGN KEY ("curator_id") REFERENCES "public"."teachers" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups" ("id") ON DELETE cascade ON UPDATE no action;