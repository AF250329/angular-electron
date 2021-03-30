export class VisualLabel {
  key: string;
  value: string;
}

export class VisualTest {
  id: string;
  FullyQualifiedName: string;
  DisplayName: string;
  OriginalSource: string;
  VisualSourceText: string;
  CodeFilePath: string;
  LineNumber: number;
  Labels: Array<VisualLabel>;
}
