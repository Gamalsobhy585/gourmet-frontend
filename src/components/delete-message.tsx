import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

function DeleteMessage({
  close,
  onDelete,
  thing
}: {
  close: () => void;
  onDelete: () => void;
  thing:string
}) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-primary text-3xl font-semibold mb-2 text-center">
        {t('delete_messages.confirm')} {thing}
      </h3>
      <h4 className="text-2xl font-medium mb-10 text-center">
        {t('delete_messages.confirm_delete')}  { thing }
      </h4>
      <div className="flex justify-between">
        <Button onClick={() => onDelete()} className="w-[48%]">
          {t('delete_messages.confirm')}
        </Button>
        <Button
          onClick={() => close()}
          className="w-[48%] bg-white border-primary text-p border hover:text-white"
        >
          {t('delete_messages.cancel_delete')}
        </Button>
      </div>
    </div>
  );
}

export default DeleteMessage;
