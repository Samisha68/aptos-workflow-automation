import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Automate Your Blockchain Workflows
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AptoWorkflow helps you build, manage, and execute automated workflows on the Aptos blockchain. Connect your wallet, create workflows, and let automation handle the rest.
        </p>
        <div className="mt-8 flex space-x-4 justify-center">
          <Link href="/workflows">
            <Button variant="primary" size="lg">View Workflows</Button>
          </Link>
          <Link href="/workflows/create">
            <Button variant="outline" size="lg">Create Workflow</Button>
          </Link>
        </div>
      </section>

      <section className="py-12 w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Chain Automation</h3>
            <p className="text-gray-600">
              Automate complex on-chain operations with multi-step workflows that execute automatically.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">DeFi Integration</h3>
            <p className="text-gray-600">
              Connect with DEXs, lending protocols, and staking platforms for seamless DeFi interactions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">User-Friendly</h3>
            <p className="text-gray-600">
              Simple interface to create, manage, and monitor your blockchain workflows without complex coding.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}