/*
  Warnings:

  - You are about to drop the column `introduce` on the `Member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mark,member]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mark,member]` on the table `Report` will be added. If there are existing duplicate values, this will fail.
  - Made the column `member` on table `FollowBook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `member` on table `Likes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maker` on table `Mark` required. This step will fail if there are existing NULL values in that column.
  - Made the column `member` on table `Talk` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `FollowBook` DROP FOREIGN KEY `fk_FollowBook_member`;

-- DropForeignKey
ALTER TABLE `Likes` DROP FOREIGN KEY `fk_Likes_member`;

-- DropForeignKey
ALTER TABLE `Mark` DROP FOREIGN KEY `fk_Mark_maker_Member`;

-- DropForeignKey
ALTER TABLE `Talk` DROP FOREIGN KEY `fk_Talk_member`;

-- AlterTable
ALTER TABLE `FollowBook` MODIFY `member` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Likes` MODIFY `member` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `Mark` MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `link` VARCHAR(1000) NOT NULL,
    MODIFY `image` VARCHAR(500) NULL,
    MODIFY `maker` INTEGER UNSIGNED NOT NULL,
    MODIFY `descript` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `Member` DROP COLUMN `introduce`,
    ADD COLUMN `descript` VARCHAR(512) NULL,
    ADD COLUMN `emailcheck` VARCHAR(256) NULL,
    ADD COLUMN `outdt` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `Talk` MODIFY `member` INTEGER UNSIGNED NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Likes_mark_member_key` ON `Likes`(`mark`, `member`);

-- CreateIndex
CREATE UNIQUE INDEX `Report_mark_member_key` ON `Report`(`mark`, `member`);

-- AddForeignKey
ALTER TABLE `FollowBook` ADD CONSTRAINT `fk_FollowBook_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `fk_Likes_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mark` ADD CONSTRAINT `fk_Mark_maker_Member` FOREIGN KEY (`maker`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Talk` ADD CONSTRAINT `fk_Talk_member` FOREIGN KEY (`member`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
