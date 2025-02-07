-- CreateTable
CREATE TABLE `tbl_supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sup_name` VARCHAR(191) NOT NULL,
    `sup_contact` VARCHAR(191) NOT NULL,
    `sup_email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_supplier_sup_name_key`(`sup_name`),
    UNIQUE INDEX `tbl_supplier_sup_email_key`(`sup_email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
