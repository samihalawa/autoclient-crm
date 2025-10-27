import { type VariableOption } from '../types/sequence.types';

interface VariablePickerProps {
  onSelect: (variable: string) => void;
}

const VARIABLES: VariableOption[] = [
  {
    label: 'Person',
    value: 'person',
    children: [
      {
        label: 'Name',
        value: 'name',
        children: [
          { label: 'First name', value: '{{person.name.first}}' },
          { label: 'Last name', value: '{{person.name.last}}' },
          { label: 'Full name', value: '{{person.name.full}}' },
        ],
      },
      { label: 'Email', value: '{{person.email}}' },
      { label: 'Company', value: '{{person.company}}' },
      { label: 'Title', value: '{{person.title}}' },
    ],
  },
  {
    label: 'Company',
    value: 'company',
    children: [
      { label: 'Name', value: '{{company.name}}' },
      { label: 'Domain', value: '{{company.domain}}' },
      { label: 'Industry', value: '{{company.industry}}' },
    ],
  },
  {
    label: 'Sequence',
    value: 'sequence',
    children: [
      { label: 'Name', value: '{{sequence.name}}' },
      { label: 'Owner name', value: '{{sequence.owner.name}}' },
    ],
  },
];

export const VariablePicker: React.FC<VariablePickerProps> = ({ onSelect }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-64">
      <div className="px-3 py-2 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase">
          Insert Variable
        </h3>
      </div>
      <div className="max-h-96 overflow-auto">
        {VARIABLES.map((category) => (
          <div key={category.value} className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500">
              {category.label}
            </div>
            {category.children?.map((subCategory) => {
              if (subCategory.children !== undefined) {
                return (
                  <div key={subCategory.value} className="ml-4">
                    <div className="px-3 py-1 text-xs text-gray-500">
                      {subCategory.label}
                    </div>
                    {subCategory.children.map((variable) => (
                      <button
                        key={variable.value}
                        onClick={() => onSelect(variable.value)}
                        className="w-full text-left px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {variable.label}
                      </button>
                    ))}
                  </div>
                );
              }
              return (
                <button
                  key={subCategory.value}
                  onClick={() => onSelect(subCategory.value)}
                  className="w-full text-left px-6 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  {subCategory.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
