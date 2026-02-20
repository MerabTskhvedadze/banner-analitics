"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Upload, Typography, message, Button, Space } from "antd";
import type { UploadProps, UploadFile } from "antd";
import { CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 10;

type ImgUploadProps = {
  variant?: "full" | "inline";
  onFileSelect?: (file: File) => void;
  onClear?: () => void;
};

export function ImgUpload({ variant = "full", onFileSelect, onClear }: ImgUploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const lastObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
    };
  }, []);

  const previewUrl = fileList[0]?.url as string | undefined;

  const clear = () => {
    if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
    lastObjectUrl.current = null;
    setFileList([]);
    onClear?.();
  };

  const props: UploadProps = useMemo(
    () => ({
      multiple: false,
      accept: ACCEPTED_TYPES.join(","),
      fileList,
      showUploadList: false,
      beforeUpload: (file) => {
        const isAccepted = ACCEPTED_TYPES.includes(file.type);
        if (!isAccepted) {
          message.error("Unsupported format. Please use PNG, JPG, or WebP.");
          return Upload.LIST_IGNORE;
        }

        const isLtMax = file.size / 1024 / 1024 <= MAX_SIZE_MB;
        if (!isLtMax) {
          message.error(`File too large. Maximum is ${MAX_SIZE_MB}MB.`);
          return Upload.LIST_IGNORE;
        }

        if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);

        const url = URL.createObjectURL(file);
        lastObjectUrl.current = url;

        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url,
            originFileObj: file,
          },
        ]);

        onFileSelect?.(file as File);

        return false; // don't upload automatically
      },
    }),
    [fileList, onFileSelect]
  );

  const Preview = previewUrl ? (
    <div
      style={{ marginTop: 12 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <img
        src={previewUrl}
        alt={fileList[0]?.name || "Uploaded preview"}
        style={{
          maxHeight: 132,
          width: "100%",
          objectFit: "cover",
          borderRadius: 12,
          display: "block",
        }}
      />

      <Space style={{ marginTop: 10 }}>
        <Button danger icon={<DeleteOutlined />} onClick={clear}>
          Remove banner
        </Button>
      </Space>
    </div>
  ) : null;

  return (
    <Dragger {...props} className={variant === "inline" ? "antd-dropzone-inline" : "antd-dropzone-full"}>
      {variant === "inline" ? (
        <Typography.Text className="antd-dropzone-inline-text">
          Drop files anywhere to upload
        </Typography.Text>
      ) : (
        <div className="antd-dropzone-full-inner">
          <div className="antd-dropzone-iconWrap">
            <CloudUploadOutlined className="antd-dropzone-icon" />
          </div>

          <Typography.Title level={5} className="antd-dropzone-title">
            Click or drag banner here
          </Typography.Title>

          <Typography.Text className="antd-dropzone-hint">
            Support for PNG, JPG, WebP (Max {MAX_SIZE_MB}MB)
          </Typography.Text>
        </div>
      )}

      {Preview}
    </Dragger>
  );
}