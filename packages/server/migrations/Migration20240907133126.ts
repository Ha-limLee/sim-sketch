import { Migration } from '@mikro-orm/migrations';

export class Migration20240907133126 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "profile_image" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
