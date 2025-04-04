ALTER TABLE "user_info" ALTER COLUMN "cpf" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "phone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "cep" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "street" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "complement" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "neighborhood" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_info" ALTER COLUMN "state" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "trimestral_price" numeric;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "semestral_price" numeric;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "anual_price" numeric;