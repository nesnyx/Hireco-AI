
import GlowCard from './UI/GlowCard'

const FeatureCard = ({ icon: Icon, title, description, features } : any) => {
    return (
        <GlowCard className="h-full">
            <div className="text-center">
                <div className="p-4 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-2xl inline-flex mb-6">
                    <Icon className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <p className="text-slate-400 mb-6">{description}</p>
                <ul className="space-y-2 text-left">
                    {features.map((feature:any, index:any) => (
                        <li key={index} className="flex items-center text-slate-300">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 shrink-0"></div>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
        </GlowCard>
    );
};

export default FeatureCard;