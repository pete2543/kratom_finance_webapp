-- CreateTable
CREATE TABLE object_document (
    object_document_id UUID NOT NULL DEFAULT gen_random_uuid(),
    etag VARCHAR(255) NOT NULL,
    bucket VARCHAR(100),
    folder1 VARCHAR(100),
    full_path VARCHAR(300),
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    content_size NUMERIC(18, 2),
    file_extention VARCHAR(255),
    object_name VARCHAR(255),
    table_name VARCHAR(200),
    table_id UUID,
    table_id2 UUID NOT NULL,
    created_by UUID NOT NULL,
    created_date TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    updated_by UUID,
    updated_date TIMESTAMPTZ(6),

    CONSTRAINT object_document_pkey PRIMARY KEY (object_document_id)
);

COMMENT ON TABLE object_document IS 'ตารางเก็บข้อมูลของไฟล์เอกสาร';

COMMENT ON COLUMN object_document.etag IS 'สำหรับระบุที่อยู่ของ object ใน object storage server';
COMMENT ON COLUMN object_document.bucket IS 'ที่เก็บข้อมูล';
COMMENT ON COLUMN object_document.folder1 IS 'โฟร์เดอร์ไฟล์';
COMMENT ON COLUMN object_document.full_path IS 'ที่อยู่ของไฟล์';
COMMENT ON COLUMN object_document.file_name IS 'ชื่อไฟล์.นามสกุลไฟล์';
COMMENT ON COLUMN object_document.content_type IS 'รุปแบบเนื้อหา';
COMMENT ON COLUMN object_document.content_size IS 'ขนาดของเนื่อหา';
COMMENT ON COLUMN object_document.file_extention IS 'นามสกุลไฟล์';
COMMENT ON COLUMN object_document.object_name IS 'ชื่อ object';
COMMENT ON COLUMN object_document.table_name IS 'ตารางอ้างอิงการแนบไฟล์';
COMMENT ON COLUMN object_document.table_id IS 'คีย์ตารางอ้างอิงการแนบไฟล์';
