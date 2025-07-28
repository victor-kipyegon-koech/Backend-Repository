CREATE TYPE "public"."bookingStatus" AS ENUM('pending', 'confirmed', 'canceled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('pending', 'failed', 'canceled', 'completed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."userType" AS ENUM('member', 'admin', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."ticketPriority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."ticketStatus" AS ENUM('pending', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
CREATE TABLE "bookingTable" (
	"bookingId" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"eventId" integer NOT NULL,
	"quantity" integer NOT NULL,
	"totalAmount" numeric NOT NULL,
	"status" "bookingStatus" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "eventTable" (
	"eventId" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"venueId" integer NOT NULL,
	"category" varchar,
	"date" varchar,
	"time" varchar,
	"ticketPrice" numeric NOT NULL,
	"ticketsTotal" integer NOT NULL,
	"ticketsSold" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "paymentTable" (
	"paymentId" serial PRIMARY KEY NOT NULL,
	"bookingId" integer NOT NULL,
	"amount" numeric NOT NULL,
	"paymentStatus" "paymentStatus" DEFAULT 'pending',
	"paymentDate" timestamp DEFAULT now(),
	"paymentMethod" varchar,
	"transactionId" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stripeConfigTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"publishableKey" varchar NOT NULL,
	"secretKey" varchar NOT NULL,
	"webhookEndpoint" varchar NOT NULL,
	"currency" varchar DEFAULT 'USD',
	"testMode" boolean DEFAULT true,
	"stripeEnabled" boolean DEFAULT true,
	"paymentMethods" text[] DEFAULT '{}' NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supportTable" (
	"ticketId" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"priority" "ticketPriority" DEFAULT 'medium' NOT NULL,
	"status" "ticketStatus" DEFAULT 'pending',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "userTable" (
	"userId" serial PRIMARY KEY NOT NULL,
	"firstName" varchar,
	"lastName" varchar,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"contactPhone" varchar,
	"address" text,
	"userType" "userType" DEFAULT 'member',
	"avatar_url" varchar(500),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "userTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "venueTable" (
	"venueId" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" text,
	"capacity" integer NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "webhookLogTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"event" varchar NOT NULL,
	"status" varchar NOT NULL,
	"receivedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bookingTable" ADD CONSTRAINT "bookingTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookingTable" ADD CONSTRAINT "bookingTable_eventId_eventTable_eventId_fk" FOREIGN KEY ("eventId") REFERENCES "public"."eventTable"("eventId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventTable" ADD CONSTRAINT "eventTable_venueId_venueTable_venueId_fk" FOREIGN KEY ("venueId") REFERENCES "public"."venueTable"("venueId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentTable" ADD CONSTRAINT "paymentTable_bookingId_bookingTable_bookingId_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."bookingTable"("bookingId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTable" ADD CONSTRAINT "supportTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE cascade ON UPDATE no action;