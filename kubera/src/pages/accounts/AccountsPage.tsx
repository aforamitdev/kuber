import { useState } from "react";
import { useAtom } from "jotai";
import { PlusIcon, WalletIcon } from "@phosphor-icons/react";
import { AccountForm } from "@/components/accounts/AccountForm";
import { AccountsList } from "@/components/accounts/AccountsList";
import { TotalAssetsChart } from "@/components/accounts/TotalAssetsChart";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { TONE_CLASS } from "@/lib/tones";
import { accountsAtom } from "@/state/atoms";

export function AccountsPage() {
  const [accounts] = useAtom(accountsAtom);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <span
              className={`grid size-8 place-items-center ${TONE_CLASS.sky}`}
            >
              <WalletIcon className="size-4" weight="duotone" />
            </span>
            Wallet
          </span>
        }
        description="Bank accounts · click an account for monthly book-keeping"
        actions={
          !open && (
            <Button
              variant="primary"
              iconLeft={<PlusIcon className="size-4" />}
              onClick={() => setOpen(true)}
            >
              Add account
            </Button>
          )
        }
      />

      <div className="mb-5">
        <TotalAssetsChart />
      </div>

      {open && (
        <div className="mb-5">
          <AccountForm
            onSubmit={() => {
              // setAccounts([...accounts, a])
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}

      <AccountsList accounts={accounts} />
    </>
  );
}
