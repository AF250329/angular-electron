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
  Selected:boolean;
  Labels: Array<VisualLabel>;
}
