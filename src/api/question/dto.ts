export interface CreateQuestionDto {
  type: string;
  postSubmit?: string;
  onLoad?: string;
  label: string;
  isRequired: boolean;
  validations: string[];
}