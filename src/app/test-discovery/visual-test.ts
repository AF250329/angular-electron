export class VisualLabel {
  key: string;
  value: string;
}

export class VisualTest {
  id: string;
  FullyQualifiedName: string;
  DisplayName: string;
  Source: string;
  CodeFilePath: string;
  LineNumber: number;
  Labels: Array<VisualLabel>;
}
