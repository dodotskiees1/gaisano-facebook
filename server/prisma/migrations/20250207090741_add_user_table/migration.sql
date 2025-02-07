-- CreateTable
CREATE TABLE `tbl_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `middle` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `month` VARCHAR(191) NOT NULL,
    `day` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_user_name_key`(`name`),
    UNIQUE INDEX `tbl_user_middle_key`(`middle`),
    UNIQUE INDEX `tbl_user_lastname_key`(`lastname`),
    UNIQUE INDEX `tbl_user_month_key`(`month`),
    UNIQUE INDEX `tbl_user_day_key`(`day`),
    UNIQUE INDEX `tbl_user_year_key`(`year`),
    UNIQUE INDEX `tbl_user_gender_key`(`gender`),
    UNIQUE INDEX `tbl_user_address_key`(`address`),
    UNIQUE INDEX `tbl_user_email_key`(`email`),
    UNIQUE INDEX `tbl_user_password_key`(`password`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
